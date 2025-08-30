from django.db import models
from django.contrib.auth import get_user_model
from books.models import Book

User = get_user_model()

class ReadingList(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reading_lists')
    is_public = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['user', 'name']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}'s {self.name}"
    

class ReadingListItem(models.Model):
    reading_list = models.ForeignKey(ReadingList, on_delete=models.CASCADE, related_name='items')
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    order = models.PositiveIntegerField(default=0)
    added_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        unique_together = ['reading_list', 'book']
        ordering = ['order', 'added_at']
    
    def __str__(self):
        return f"{self.book.title} in {self.reading_list.name}"   