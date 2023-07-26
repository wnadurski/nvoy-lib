import { FirestoreDataConverter, Timestamp } from 'firebase/firestore'
import { Message } from './types'
import { deserializePathComponent } from '../no-sql/path'

export const messageConverter: FirestoreDataConverter<Message> = {
  toFirestore: ({ id, status, timestamp, ...rest }) => ({
    ...rest,
    timestamp: timestamp && Timestamp.fromDate(timestamp as Date),
  }),
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options)

    return {
      id: deserializePathComponent(snapshot.id),
      status: snapshot.metadata.hasPendingWrites ? 'sending' : 'sent',
      ...data,
      timestamp: data.timestamp
        ? new Timestamp(
            data.timestamp.seconds,
            data.timestamp.nanoseconds
          ).toDate()
        : undefined,
    } as Message
  },
}
