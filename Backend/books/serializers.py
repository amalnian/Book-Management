import re
from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    authors_list = serializers.ListField(source='get_authors_list', read_only=True)

    class Meta:
        model = Book
        fields = [
            'id', 'title', 'authors', 'authors_list', 'genre', 'publication_date',
            'description', 'cover_image', 'isbn', 'pages', 'created_by',
            'created_by_username', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Title can't be empty")

        if not re.match(r'^[a-zA-Z0-9._-]+$', value):
            raise serializers.ValidationError(
                "Title can only contain letters, numbers, dots, underscores, and hyphens."
            )

        if value[0] in '._-' or value[-1] in '._-':
            raise serializers.ValidationError(
                "Title cannot start or end with dots, underscores, or hyphens."
            ) 
        return value

    def validate_authors(self, value):
        if not value:
            raise serializers.ValidationError("At least one author is required.")

        if any(not str(author).strip() for author in value):
            raise serializers.ValidationError("Author names cannot be blank.")

        # for author in value:
        #     if len(str(author).strip()) < 2:
        #         raise serializers.ValidationError("Author names must be at least 2 characters long.")

        for author in value:
            if str(author).isdigit():
                raise serializers.ValidationError("Author names cannot be numbers.")

        # if len(value) != len(set([str(a).strip().lower() for a in value])):
        #     raise serializers.ValidationError("Duplicate authors are not allowed.")

        return value


    
    def validate_isbn(self, value):
        if value and len(value) not in [10, 13]:
            raise serializers.ValidationError('ISBN must be 10 or 13 digits')
        
class BookCreateUpdateSerializer(BookSerializer):
    class Meta(BookSerializer.Meta):
        fields = [
            'title', 'authors', 'genre', 'publication_date',
            'description', 'cover_image', 'isbn', 'pages'
        ]