from django.db import models


class Fruits(models.Model):
    name = models.CharField(max_length=100, help_text="Favorite fruit name")


class Pizza(models.Model):
    name = models.CharField(max_length=100, help_text="Favorite pizza name")
    toppings = models.TextField(blank=True, help_text="Favorite pizza toppings")
