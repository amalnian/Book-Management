from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/book/', include('books.urls')),
    path('api/reading-list/', include('reading_lists.urls')),

]
