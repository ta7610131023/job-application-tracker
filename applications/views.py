from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from .models import Application

def index(request):
    return render(request, "applications/index.html")



def app_list(request):
    apps = Application.objects
    return JsonResponse()



@csrf_exempt
def add_app(request):


    