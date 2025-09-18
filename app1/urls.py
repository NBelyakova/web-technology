from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, RegisterView, AuthView  
from rest_framework.authtoken.views import obtain_auth_token
from app1.views import UserDetailView  # импортируем view



router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post') 

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),  # регистрация
    path('auth/', AuthView.as_view(), name='auth'),  # путь для получения токена (логина)
    path('users/me/', UserDetailView.as_view(), name='user-detail')
]