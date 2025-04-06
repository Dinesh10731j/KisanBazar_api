from django.http import JsonResponse
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password

@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            user = User(
                username=data.get('username'),
                email=data.get('email'),
                password=make_password(data.get('password')),
            )
            user.save()
            refresh = RefreshToken.for_user(user)
            return JsonResponse({
                'message': 'User registered successfully!',
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh)
            }, status=201)
        except ValidationError as e:
            return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt        
def login_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            user = User.objects.get(email=data.get('email'))
            if user.check_password(data.get('password')):
                refresh = RefreshToken.for_user(user)
                return JsonResponse({
                    'message': 'Login successful!',
                    'access_token': str(refresh.access_token),
                    'refresh_token': str(refresh)
                }, status=200)
            else:
                return JsonResponse({'error': 'Invalid credentials'}, status=401)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)


def list_user(request):
    if request.method == 'GET':
        try:
            users = User.objects.all()
            user_list = [{'id': user.id, 'username': user.username, 'email': user.email,'password':user.password} for user in users]
            return JsonResponse({'users': user_list}, status=200)
        except ValidationError as e:
            return JsonResponse({'error': str(e)}, status=400)

