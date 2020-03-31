import django.dispatch

reset_password_token_created = django.dispatch.Signal(
    providing_args=["reset_password_token"],
)

pre_password_reset = django.dispatch.Signal(providing_args=["user"])

post_password_reset = django.dispatch.Signal(providing_args=["user"])

from django.dispatch import Signal

post_email_confirmation_send = Signal(providing_args=['confirmation', ])
post_email_confirmation_confirm = Signal(providing_args=['confirmation', 'save_to_content_object', 'old_email'])