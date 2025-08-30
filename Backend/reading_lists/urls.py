from django.urls import path 
from . import views


urlpatterns = [
    path('', views.ReadingListListCreateView.as_view(), name='reading-list-list-create'),
    path('<int:pk>/', views.ReadingListDetailView.as_view(), name='reading-list-detail'),
    path('<int:list_id>/add-book/', views.AddBookToListView.as_view(), name='add-book-to-list'),
    path('<int:list_id>/items/<int:item_id>/', views.RemoveBookFromListView.as_view(), name='remove-book-from-list'),
]
