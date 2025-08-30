from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Book(models.Model):
    GENRE_CHOICES = [
        ('fiction', 'Fiction'),
        ('non_fiction', 'Non-Fiction'),
        ('mystery', 'Mystery'),
        ('romance', 'Romance'),
        ('sci_fi', 'Science Fiction'),
        ('fantasy', 'Fantasy'),
        ('biography', 'Biography'),
        ('history', 'History'),
        ('self_help', 'Self Help'),
        ('other', 'Other'),
    ]
    
    title = models.CharField(max_length=255)
    authors = models.CharField(max_length=255)  
    genre = models.CharField(max_length=20, choices=GENRE_CHOICES)
    publication_date = models.DateField()
    description = models.TextField(blank=True)
    cover_image = models.ImageField(upload_to='book_covers/', blank=True, null=True)
    isbn = models.CharField(max_length=13, unique=True, blank=True, null=True)
    pages = models.PositiveIntegerField(blank=True, null=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_books')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} by {self.authors}"
    
    def get_authors_list(self):
        return [author.strip() for author in self.authors.split(',')]