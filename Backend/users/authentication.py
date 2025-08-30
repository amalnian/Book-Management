from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from django.conf import settings

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        # Try to get token from cookie first
        raw_token = request.COOKIES.get(settings.ACCESS_TOKEN_COOKIE_NAME)
        
        if raw_token is None:
            # Fallback to header authentication for API testing
            header = self.get_header(request)
            if header is None:
                return None
            raw_token = self.get_raw_token(header)
            if raw_token is None:
                return None
        
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token