from django.db import models

class Application(models.Model):
    company = models.CharField(max_length=100)
    position = models.CharField(max_length=100)
    job_url = models.URLField(blank=True)
    status = models.CharField(max_length=30)
    date_applied = models.DateField()
    notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.company} - {self.position}"

    def serialize(self):
        return {
            "id": self.id,
            "company": self.company,
            "position": self.position,
            "job_url": self.job_url,
            "status": self.status,
            "date_applied": self.date_applied,
            "archived": self.archived,
            "notes": self.notes
        }