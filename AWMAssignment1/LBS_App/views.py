from django.http import JsonResponse
from googleplaces import GooglePlaces, types
from .models import Locate

def updatedb(request):
    try:
        lat = request.POST['lat']
        lon = request.POST['lon']

        location = Locate()
        location.lat = lat
        location.lon = lon
        location.save()
        return JsonResponse({"message": f"Set location to ({location.lat}, {location.lon})."}, status=200)
    except Exception as e:
        return JsonResponse({"message": str(e)}, status=400)


def getPlace(placeType):
    switcher = {
        'hairSalon': types.TYPE_HAIR_CARE,
        'mall': types.TYPE_SHOPPING_MALL,
        'shoe': types.TYPE_SHOE_STORE,
        'clothing': types.TYPE_CLOTHING_STORE,
        'teeth': types.TYPE_DENTIST,
        'restaurant': types.TYPE_RESTAURANT,
        'groceries': types.TYPE_GROCERY_OR_SUPERMARKET,
    }
    return switcher.get(placeType, "Invalid Argument")


def updatePlaces(request):
    API_KEY = 'AIzaSyA6JPiMICcP2AcON17VNiIMHDeL8o6fnz0'

    try:
        requestPlaceType = request.POST['type']
        currentLat = float(request.POST['lat'])
        currentLng = float(request.POST['lng'])

        names = []
        lat = []
        lng = []
        address = []
        google_places = GooglePlaces(API_KEY)

        if requestPlaceType == 'default':
            return

        query_result = google_places.nearby_search(
            lat_lng={'lat': currentLat, 'lng': currentLng}, keyword="Barbers",
            radius=3000, types=[getPlace(requestPlaceType)])

        for place in query_result.places:
            print(place.name)
            place.get_details()
            names.append(place.name)
            lat.append(float(place.geo_location['lat']))
            lng.append(float(place.geo_location['lng']))
            address.append(place.formatted_address)

        return JsonResponse({'names': names, 'lat': lat, 'lng': lng, 'address': address}, status=200, safe=False)
    except Exception as e:
        print(e)
        return JsonResponse({"message": str(e)}, status=400)