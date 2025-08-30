from rest_framework import serializers
from .models import ReadingList, ReadingListItem
from books.serializers import BookSerializer


class ReadingListItemSerializer(serializers.ModelSerializer):
    book = BookSerializer(read_only=True)
    book_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = ReadingListItem
        fields = ['id', 'book', 'book_id', 'order', 'notes', 'added_at']
        read_only_fields = ['id', 'added_at']

class ReadingListSerializer(serializers.ModelSerializer):
    items = ReadingListItemSerializer(many=True, read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    items_count = serializers.IntegerField(source='items.count', read_only=True)

    class Meta:
        model = ReadingList
        fields = [
            'id', 'name', 'description', 'user', 'user_username',
            'is_public', 'items', 'items_count', 'created_at', 'updated_at'
        ]

class ReadingListCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReadingList
        fields = ['name', 'description', 'is_public']
