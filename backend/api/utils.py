import random
import string
from django.core.mail import send_mail
from django.conf import settings

def generate_random_otp(length=6):
    """Generate a random OTP (One-Time Password) of the specified length."""
    characters = string.digits
    otp = ''.join(random.choice(characters) for _ in range(length))
    return otp

def send_password_reset_email(email, otp):
    """Send a password reset email with the OTP."""
    subject = 'Password Reset OTP'
    message = f'Your OTP for password reset is: {otp}'
    from_email = settings.DEFAULT_FROM_EMAIL
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list)