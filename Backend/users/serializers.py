from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import EmailValidator
from rest_framework import serializers
import re
from django.contrib.auth import get_user_model

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password], style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']

    def validate_username(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Username can't be empty")

        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 charecters long")
        
        if len(value) > 100:
            raise serializers.ValidationError("Username cannot exceed 100 charecters")
        
        if not re.match(r'^[a-zA-Z0-9._-]+$', value):
            raise serializers.ValidationError(
                "Username can only contain letters, numbers, dots, underscores, and hyphens."
            )
        

        if value[0] in '._-' or value[-1] in '._-':
            raise serializers.ValidationError(
                "Username cannot start or end with dots, underscores, or hyphens."
            )   
        
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        
        return value
    
    def validate_email(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError('Email address is required.')
        email_validator = EmailValidator()
        try:
            email_validator(value)
        except DjangoValidationError:
            raise serializers.ValidationError("Enter a valid email address.")
        return value
    
    def validate_first_name(self, value):
        if value:
            value = value.strip()
            
            if len(value) > 30:
                raise serializers.ValidationError("First name cannot exceed 30 characters.")
            
            if not re.match(r"^[a-zA-Z\s'-]+$", value):
                raise serializers.ValidationError(
                    "First name can only contain letters, spaces, apostrophes, and hyphens."
                )
            
            if re.match(r"^[\s'-]+$", value):
                raise serializers.ValidationError("First name must contain at least one letter.")
            
            if value[0] in " '-" or value[-1] in " '-":
                raise serializers.ValidationError(
                    "First name cannot start or end with spaces, apostrophes, or hyphens."
                )
        
        return value



    def validate_last_name(self, value):
        if value:
            value = value.strip()
            
            if len(value) > 150:
                raise serializers.ValidationError("Last name cannot exceed 150 characters.")
            
            if not re.match(r"^[a-zA-Z\s'-]+$", value):
                raise serializers.ValidationError(
                    "Last name can only contain letters, spaces, apostrophes, and hyphens."
                )
            
            if re.match(r"^[\s'-]+$", value):
                raise serializers.ValidationError("Last name must contain at least one letter.")
            
            if value[0] in " '-" or value[-1] in " '-":
                raise serializers.ValidationError(
                    "Last name cannot start or end with spaces, apostrophes, or hyphens."
                )
        
        return value

    def validate_password(self, value):
        try:
            validate_password(value)
        except DjangoValidationError as e:
            raise serializers.ValidationError(list(e.messages))
        
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        
        if len(value) > 128:
            raise serializers.ValidationError("Password cannot exceed 128 characters.")
        
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
        
        if not re.search(r'\d', value):
            raise serializers.ValidationError("Password must contain at least one number.")
        
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError(
                "Password must contain at least one special character (!@#$%^&*(),.?\":{}|<>)."
            )
        return value
        
    def validate(self, attrs):

        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError({
                'password_confirm': "Passwords don't match."
            })
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')

        user = User.objects.create_user(password=password, **validated_data)
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'bio', 'profile_picture', 'created_at']
        read_only_fields = ['id', 'created_at', 'email']  
    

