from django.shortcuts import render
from django.http import JsonResponse
def get_farmer(request,id):
    return JsonResponse({"message": "Farmer details","status":200,"id":id})