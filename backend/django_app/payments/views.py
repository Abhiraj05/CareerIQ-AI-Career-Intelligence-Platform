import stripe
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

stripe.api_key = settings.STRIPE_SECRET_KEY
# Creating Payment Intent
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_intent(request):
    try:
        amount = request.data.get("amount", 19) 
        
        intent = stripe.PaymentIntent.create(
            amount=int(amount) * 100,
            currency="usd",
            payment_method_types=["card"],
        )
        return Response({
            "client_secret": intent.client_secret,
            "publishable_key": settings.STRIPE_PUBLISHABLE_KEY
        })
    except Exception as e:
        return Response({"error": str(e)}, status=400)

# Confirm Users Payment
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_payment(request):
    payment_intent_id = request.data.get("payment_intent_id")
    try:
        intent = stripe.PaymentIntent.retrieve(payment_intent_id)
        if intent.status == "succeeded":
            return Response({"status": "success", "message": "Payment successful"})
        else:
            return Response({"error": "Payment not successful"}, status=400)
    except Exception as e:
        return Response({"error": str(e)}, status=400)
