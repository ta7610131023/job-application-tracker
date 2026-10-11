from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    # API Routes
    path("applications", views.applications, name="applications"),
    path("applications/<int:app_id>", views.application, name="application"),
    ]