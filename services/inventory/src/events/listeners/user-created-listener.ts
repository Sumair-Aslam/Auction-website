// import { Listener, Subjects, UserCreatedEvent } from '@jjmauction/common';
import { Listener, Subjects, UserCreatedEvent } from 'scytalelabs-auction';

import { Message } from 'node-nats-streaming';
import { User } from '../../models';

import { queueGroupName } from './queue-group-name';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  queueGroupName = queueGroupName;
  subject: Subjects.UserCreated = Subjects.UserCreated;

  async onMessage(data: UserCreatedEvent['data'], msg: Message) {
    const { id, name,email } = data;
    
    const _user = await User.findOne({
      where: { id: id },
    }).then(function (_user) {
        // you can now access the newly created user
        console.log('success', _user.toJSON());
      })
      .catch(function (err) {
        // print the error details
        console.log('Error while Finding user : ', err);
      });
    console.log("User data : ", _user);
    await User.findOrCreate({ where: { id: id } , defaults : {id,name,email}})
    .then(function (user) {
        // you can now access the newly created user
        console.log('success', user);
      })
      .catch(function (err) {
        // print the error details
        console.log('Error while Creating user : ', err);
      });
;

    msg.ack();
  }
}
