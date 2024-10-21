import json
from user.models import CustomUser
from channels.generic.websocket import WebsocketConsumer


class UserConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()
        params =  self.scope['url_route']['kwargs']
        uid = params['uid'].replace("_", "-")

        self.user = CustomUser.objects.get(id=uid)
        self.channel_layer.group_add(self.user.id, self.channel_name)

        print('connected')

    def disconnect(self, close_code):
        pass

    def notify(self, event):
        self.send(text_data=json.dumps(event))