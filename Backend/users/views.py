# users/views.py
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.contrib.auth import get_user_model, authenticate
from django.conf import settings
from django.middleware.csrf import get_token
from datetime import datetime, timedelta
from .serializers import UserRegistrationSerializer, UserProfileSerializer
import logging

logger = logging.getLogger(__name__)
User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        print(f"DEBUG: Received email: {email}")
        print(f"DEBUG: Received password: {'*' * len(password) if password else 'None'}")
        print(f"DEBUG: Request data: {request.data}")

        if not email or not password:
            print("DEBUG: Missing email or password")
            return Response(
                {'error': 'Email and password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            db_user = User.objects.get(email=email)
            print(f"DEBUG: User found in DB: {db_user.email}")
            print(f"DEBUG: User is_active: {db_user.is_active}")
            print(f"DEBUG: User has_usable_password: {db_user.has_usable_password()}")
            
            password_check = db_user.check_password(password)
            print(f"DEBUG: Direct password check result: {password_check}")
            
        except User.DoesNotExist:
            print(f"DEBUG: User with email {email} not found in database")
            return Response(
                {'error': 'Invalid credentials'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        print(f"DEBUG: Attempting authentication with username={email}")
        user = authenticate(request, username=email, password=password)
        print(f"DEBUG: Authentication result: {user}")
        
        if user:
            print(f"DEBUG: Authentication successful for {user.email}")
            
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            response = Response(
                {
                    'message': 'Login successful',
                    'user': UserProfileSerializer(user).data
                }
            )

            response.set_cookie(
                settings.ACCESS_TOKEN_COOKIE_NAME,
                str(access_token),
                max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
                httponly=True,
                secure=settings.SESSION_COOKIE_SECURE,
                samesite=settings.SESSION_COOKIE_SAMESITE
            )
            
            response.set_cookie(
                settings.REFRESH_TOKEN_COOKIE_NAME,
                str(refresh),
                max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds(),
                httponly=True,
                secure=settings.SESSION_COOKIE_SECURE,
                samesite=settings.SESSION_COOKIE_SAMESITE
            )
            
            response['X-CSRFToken'] = get_token(request)
            
            return response
        else:
            print(f"DEBUG: Authentication failed for {email}")
            return Response(
                {'error': 'Invalid credentials'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
            

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get(settings.REFRESH_TOKEN_COOKIE_NAME)
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
        except Exception as e:
            logger.warning(f"Failed to blacklist token during logout: {e}")
        
        response = Response({'message':'Logout Successfully'})
        response.delete_cookie(settings.ACCESS_TOKEN_COOKIE_NAME)
        response.delete_cookie(settings.REFRESH_TOKEN_COOKIE_NAME)
        return response
    

class RefreshTokenView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get(settings.REFRESH_TOKEN_COOKIE_NAME)

        if not refresh_token:
            logger.warning("Refresh token not found in cookies")
            return Response(
                {'error':'Refresh token not found'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            refresh = RefreshToken(refresh_token)
            access_token = refresh.access_token

            response = Response({'message': 'Token refreshed successfully'})

            response.set_cookie(                
                settings.ACCESS_TOKEN_COOKIE_NAME,
                str(access_token),
                max_age=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds(),
                httponly=True,
                secure=settings.SESSION_COOKIE_SECURE,
                samesite=settings.SESSION_COOKIE_SAMESITE
            )
            
            logger.info("Token refreshed successfully")
            return response 
    
        except TokenError as e:
            logger.warning(f"Invalid refresh token: {e}")
            response = Response(
                {'error':'Invalid refresh token'},
                status=status.HTTP_401_UNAUTHORIZED
            )
            response.delete_cookie(settings.ACCESS_TOKEN_COOKIE_NAME)
            response.delete_cookie(settings.REFRESH_TOKEN_COOKIE_NAME)
            return response
        except Exception as e:
            logger.error(f"Unexpected error during token refresh: {e}")
            return Response(
                {'error':'Token refresh failed'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)
    
    def put(self, request):
        try:
            serializer = UserProfileSerializer(
                request.user, 
                data=request.data, 
                partial=True
            )
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response(
                {"error": "Failed to update profile", "detail": str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class CSRFTokenView(APIView):
    """Get CSRF token for frontend"""
    permission_classes = [AllowAny]
    
    def get(self, request):
        return Response({'csrfToken': get_token(request)})