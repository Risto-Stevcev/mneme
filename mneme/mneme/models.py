import datetime
from flask import url_for
from mneme import db


class Mneme(db.DynamicDocument):
    created_at = db.DateTimeField(default=datetime.datetime.now, required=True)
    title = db.StringField(max_length=255, required=True)
    body = db.DictField(required=True)

    def __unicode__(self):
        return self.title

    meta = {
        'indexes': ['-created_at', 'title'],
        'ordering': ['-created_at']
    }
