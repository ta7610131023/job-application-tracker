from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from .models import Application

def index(request):
    return render(request, "applications/index.html")
