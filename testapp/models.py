from django.db import models


class Fruits(models.Model):
    name = models.CharField(max_length=100, help_text="Favorite fruit name")


class Pizza(models.Model):
    cheese_choices = (
        ('mozzarella', 'Mozzarella'),
        ('provolone', 'Provolone'),
        ('cheddar', 'Cheddar'),
        ('ricotta', 'Ricotta')
    )

    toppings_choices = (
        ('pepperoni', 'Pepperoni'),
        ('sausage', 'Sausage'),
        ('olives', 'Olives'),
        ('spinach', 'Spinach'),
        ('mushrooms', 'Mushrooms'),
        ('bacon', 'Bacon'),
        ('bell pepper', 'Bell Pepper'),
        ('onions', 'Onions'),
        ('cheese', 'Cheese'),
        ('pineapple', 'Pineapple'),
    )

    name = models.CharField(max_length=100, help_text="Favorite pizza name")
    toppings = models.CharField(blank=False, null=True, help_text="Favorite pizza toppings", choices=toppings_choices, max_length=255)
    cheese = models.CharField(blank=True, help_text="Favorite pizza cheese", choices=cheese_choices, max_length=100)
