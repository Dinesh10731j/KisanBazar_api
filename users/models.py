from django.db import models
from django.contrib.auth.hashers import make_password
from django.core.exceptions import ValidationError

class User(models.Model):
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    email = models.EmailField(max_length=100, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.pk and User.objects.filter(email=self.email).exists():
            raise ValidationError("A user with this email already exists.")
        if not self.pk or 'pbkdf2' not in self.password:
            self.password = make_password(self.password)

        super().save(*args, **kwargs)

    def __str__(self):
        return self.username



class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=100,unique=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self ,*args, **kwargs):
        if not self.pk and Contact.objects.filter(email=self.email).exists():
            raise ValidationError("A contact with this email already exists.")
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
