from rest_framework import viewsets, generics
from .models import Post
from .serializers import PostSerializer, RegisterSerializer
from rest_framework.permissions import SAFE_METHODS, BasePermission, IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authtoken.models import Token


# для безопасных методов (GET, HEAD, OPTIONS) открывает доступ всем, 
# для остальных методов проверяет, что пользователь является автором объекта

class IsAuthorOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.author == request.user

# авторизованные пользователи могут создавать, править, удалять посты,
# удалять пост может только автор,
# неавторизованные пользователи могут только смотреть,
# при создании поста автором обозначается текущий пользователь

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

# все пользователи могут зарегистрироваться

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]  # Регистрироваться может любой пользователь

# вью для авторизации пользователя

class AuthView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,  # ← простой токен
            })
        return Response({'detail': 'Неверный логин или пароль'}, status=status.HTTP_400_BAD_REQUEST)
    

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            # другие поля, если нужно
        }
        return Response(data)