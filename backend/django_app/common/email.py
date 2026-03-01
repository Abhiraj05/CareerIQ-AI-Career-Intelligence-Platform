from django.core.mail import send_mail
from django.contrib import messages


# send a email to customer
def send_email(request,distributer_email,customer_email,message,mail_sub):
    try:
        send_mail(
            f"{mail_sub}",
            f"""
            {message}
            """,
            distributer_email,
            [customer_email],
            fail_silently=False,
        )
    except:
        messages.error(request,"email not sent!")