from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters
from .models import Book
from .serializers import BookSerializer, BookCreateUpdateSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated

class BookListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Book.objects.all()
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['genre', 'created_by']
    search_fields = ['title', 'authors', 'description']
    ordering_fields = ['created_at', 'title', 'publication_date']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return BookCreateUpdateSerializer
        return BookSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class BookDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return BookCreateUpdateSerializer
        return BookSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]
        return [permissions.IsAuthenticated()]

    
class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.created_by == request.user