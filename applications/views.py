import json
from django.http import JsonResponse
from django.shortcuts import render, HttpResponse
from .models import Application
from django.views.decorators.csrf import csrf_exempt

def index(request):
    return render(request, "application/index.html")



@csrf_exempt
def applications(request):
    # Return all applications
    if request.method == "GET":
        apps = Application.objects.all()
        # Return list of apps in reverse chronologial order
        apps = apps.order_by("-date_applied")
        return JsonResponse([app.serialize() for app in apps], safe=False)

    # create an new app must be via POST
    elif request.method == "POST":
        # Get contents of app
        data = json.loads(request.body)
        company = data.get("company","")
        position = data.get("position","")
        job_url = data.get("job_url","")
        status = data.get("status","")
        date_applied = data.get("date_applied","")
        notes = data.get("notes","")

        # validation
        if not company or not position or not status or not date_applied:
            return JsonResponse({"error": "This cannot be blank."}, status=400)
        
        # Create app in db
        app = Application(
            company=company,
            position=position,
            job_url=job_url,
            status=status,
            date_applied=date_applied,
            notes=notes
        )
        app.save()

        return JsonResponse({"message": "Application created successfully"}, status=201)

    else:
        return JsonResponse({"error": "POST or GET request required."}, status=400)



@csrf_exempt
def application(request, app_id):
    # query for requested application
    try:
        app = Application.objects.get(pk=app_id)

    except Application.DoesNotExist:
        return JsonResponse({"error": "application not found."}, status=404)

    # return application contents
    if request.method == "GET":
        return JsonResponse(app.serialize())

    elif request.method == "PUT":
        data = json.loads(request.body)
        if data.get("status") is not None:
            if not data.get("status"):
                return JsonResponse({"error": "This cannot be blank."}, status=400)
            
            app.status = data["status"]
            
        if data.get("notes") is not None:
            app.notes = data["notes"]
        app.save()
        return HttpResponse(status=204)

    else:
        return JsonResponse({"error": "GET or PUT request required."}, status=400)