from django.contrib.sessions.backends.db import SessionStore as DBStore
from django.contrib.sessions.base_session import AbstractBaseSession
from django.db import models
from django.db import DatabaseError, IntegrityError, router, transaction
from django.contrib.sessions.backends.base import (
    CreateError, SessionBase, UpdateError,
)

class SessionStore(DBStore):
    def create(self, **kwargs):
        while True:
            self._session_key = self._get_new_session_key()
            try: 
                self.save(must_create=True, using='default')
            except CreateError:
                continue
            self.modified = True
            return

    def save(self, must_create=False, using='default', **kwargs):
        """
        Save the current session data to the database. If 'must_create' is
        True, raise a database error if the saving operation doesn't create a
        new entry (as opposed to possibly updating an existing entry).
        """
        if self.session_key is None:
            return self.create(using=using)
        data = self._get_session(no_load=must_create)
        obj = self.create_model_instance(data)
        # using = router.db_for_write(self.model, instance=obj)

        try:
            with transaction.atomic(using=using):

                obj.save(force_insert=must_create, force_update=not must_create, using=using)
        except IntegrityError:
            if must_create:
                raise CreateError
            raise
        except DatabaseError:
            if not must_create:
                raise UpdateError
            raise

