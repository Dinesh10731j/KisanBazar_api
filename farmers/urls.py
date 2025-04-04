from django.urls import path,include
from . import views
urlpatterns = [
    path('<int:id>/',views.get_farmer)
]
