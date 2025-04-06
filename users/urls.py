from django.urls import path
from . import views
urlpatterns = [
    path('users/register', views.register_user),
    path('users/login', views.login_user),
    path('users/list',views.list_user)
    
]
