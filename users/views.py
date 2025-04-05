from django.http import JsonResponse
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
import json
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def register_user(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            user = User(
                username=data.get('username'),
                email=data.get('email'),
                password=data.get('password')
            )
            user.save()
            return JsonResponse({'message': 'User registered successfully!'}, status=201)
        except ValidationError as e:
            return JsonResponse({'error': str(e)}, status=400)

from django.http import JsonResponse
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User

def list_user(request):
    if request.method == 'GET':
        try:
            users = User.objects.all()
            user_list = [{'id': user.id, 'username': user.username, 'email': user.email} for user in users]
            return JsonResponse({'users': user_list}, status=200)
        except ValidationError as e:
            return JsonResponse({'error': str(e)}, status=400)

