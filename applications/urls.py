from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    # API Routes
    path("applications/app_list", views.app_list, name="app_list"),
    path("applications/add_app", views.add_app, name="add_app"),
    ]