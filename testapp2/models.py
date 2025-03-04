from django.db import models

from dynamic_forms.registry import ModelForms


class Member(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField()
    phone = models.CharField(max_length=50)

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class Cars(models.Model):
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.IntegerField()
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='cars', null=True, blank=True)

    def __str__(self):
        return f'{self.make} {self.model} {self.year}'
