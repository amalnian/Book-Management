from rest_framework import generics, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import ReadingList, ReadingListItem
from .serializers import (
    ReadingListSerializer, 
    ReadingListCreateUpdateSerializer,
    ReadingListItemSerializer
)
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

class ReadingListListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ReadingListCreateUpdateSerializer
        return ReadingListSerializer
    
    def get_queryset(self):
        return ReadingList.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ReadingListDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return ReadingListCreateUpdateSerializer
        return ReadingListSerializer
    
    def get_queryset(self):
        return ReadingList.objects.filter(user=self.request.user)
    

class AddBookToListView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, list_id):
        try:
            reading_list = ReadingList.objects.get(id=list_id, user=request.user)
        except ReadingList.DoesNotExist:
            return Response({'error': 'Reading list not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ReadingListItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(reading_list=reading_list)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RemoveBookFromListView(APIView):
    permission_classes = [IsAuthenticated]


    def delete(self, request, list_id, item_id):
        try:
            reading_list = ReadingList.objects.get(id=list_id, user=request.user)
            item = ReadingListItem.objects.get(id=item_id, reading_list=reading_list)
            item.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except (ReadingList.DoesNotExist, ReadingListItem.DoesNotExist):
            return Response({'error': 'Item not found'}, status=status.HTTP_404_NOT_FOUND)