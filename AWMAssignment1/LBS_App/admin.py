from django.contrib.gis import admin
from .models import WorldBorder, Locate

admin.site.register(WorldBorder, admin.OSMGeoAdmin)
admin.site.register(Locate, admin.OSMGeoAdmin)
