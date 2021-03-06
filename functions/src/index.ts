import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
const firebase_tools = require('firebase-tools')
import { Storage } from '@google-cloud/storage'
import * as csv2json from 'csvtojson'

import * as serviceAccount from '../../firebase-service-key-dev.json'
import { Activity } from '../../src/services/models/activity'
import { User } from '../../src/services/models/user'
import { Career } from '../../src/services/models/career'
import { SkillStacks } from '../../src/services/models/skillStacks'
import { ExternalServices } from '../../src/services/models/externalServices'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
})
const db = admin.firestore()
const storage = new Storage()

const userRegister = async () => {
  const ref = db.collection('users')
  // Downloads the file
  const csvstr = await storage
    .bucket('jeeek-dev-firestore-seed')
    .file('jeeek_dev_users.csv')
    .download()
    .then(buf => {
      return buf.toString()
    })

  const userDocs = await csv2json({ nullObject: false })
    .fromString(csvstr)
    .then(jsonObj => {
      return jsonObj.map((record: User) => ({
        ...record,
      }))
    })

  const csvstr2 = await storage
    .bucket('jeeek-dev-firestore-seed')
    .file('jeeek_dev_activities.csv')
    .download()
    .then(buf => {
      return buf.toString()
    })

  const activityDocs = await csv2json()
    .fromString(csvstr2)
    .then(jsonObj => {
      return jsonObj.map((record: Activity) => ({
        ...record,
        category: Number(record.category),
        rank: Number(record.rank),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }))
    })

  for (const userDoc of userDocs) {
    // null itemの削除
    userDoc.followers = userDoc.followers.filter(elem => elem.uid !== '')
    userDoc.followings = userDoc.followings.filter(elem => elem.uid !== '')
    const { uid } = userDoc.userTiny
    if (uid !== null) {
      await ref.doc(uid).set(userDoc)
    }
    const followUserUIDs = userDoc.followings.map(elem => elem.uid)
    followUserUIDs.push(uid)
    const followUserActivities = activityDocs.filter(
      elem => followUserUIDs.indexOf(elem.userTiny.uid) >= 0,
    )
    for (const doc of followUserActivities) {
      // null itemの削除
      doc.tags = doc.tags.filter(elem => elem)
      doc.favorites = doc.favorites.filter(elem => elem)
      doc.gifts = doc.gifts.filter(elem => elem)
      const { id } = doc
      const docWithoutId = { ...doc }
      delete docWithoutId.id
      if (id !== null) {
        await ref
          .doc(uid)
          .collection('timeline')
          .doc(id)
          .set(docWithoutId)
      }
    }
  }
  return 'OK'
}

const careerRegister = async () => {
  const ref = db.collection('careers')
  // Downloads the file
  const csvstr = await storage
    .bucket('jeeek-dev-firestore-seed')
    .file('jeeek_dev_careers.csv')
    .download()
    .then(buf => {
      return buf.toString()
    })

  const docs = await csv2json()
    .fromString(csvstr)
    .then(jsonObj => {
      return jsonObj.map((record: Career) => ({
        ...record,
      }))
    })

  for (const doc of docs) {
    // null itemの削除
    doc.education = doc.education.filter(elem => elem.period !== '')
    doc.workExperience = doc.workExperience.filter(elem => elem.period !== '')
    doc.certification = doc.certification.filter(elem => elem.period !== '')
    const { uid } = doc
    const docWithoutId = { ...doc }
    delete docWithoutId.uid
    if (uid !== null) {
      await ref.doc(uid).set(docWithoutId)
    }
  }
  return 'OK'
}

const skillStackRegister = async () => {
  const ref = db.collection('skillStacks')
  // Downloads the file
  const csvstr = await storage
    .bucket('jeeek-dev-firestore-seed')
    .file('jeeek_dev_skills.csv')
    .download()
    .then(buf => {
      return buf.toString()
    })

  const docs = await csv2json()
    .fromString(csvstr)
    .then(jsonObj => {
      return jsonObj.map((record: SkillStacks) => ({
        ...record,
      }))
    })

  for (const doc of docs) {
    // null itemの削除
    doc.skills = doc.skills.filter(elem => elem.tag !== '')
    // eslint-disable-next-line no-plusplus
    for (const skill of doc.skills) {
      skill.point = Number(skill.point)
    }
    const {uid} = doc
    const docWithoutId = {...doc}
    delete docWithoutId.uid
    if (uid !== null) {
      await ref.doc(uid).set(docWithoutId)
    }
    const ref2 = db.collection('skillTags')
    if (!doc.skills) continue
    for (const skill of doc.skills) {
      // skill_tagの存在確認
      const tag = await ref2.doc(skill.tag).get()
      if (tag.exists) {
        await ref2
          .doc(skill.tag)
          .collection('skillHolders')
          .doc(uid)
          .update({point: skill.point})
      } else {
        await ref2
          .doc(skill.tag)
          .collection('skillHolders')
          .doc(uid)
          .set({point: skill.point})
      }
    }
  }
  return 'OK'
}

const externalServiceRegister = async () => {
  const ref = db.collection('externalServices')
  // Downloads the file
  const csvstr = await storage
    .bucket('jeeek-dev-firestore-seed')
    .file('jeeek_dev_extServices.csv')
    .download()
    .then(buf => {
      return buf.toString()

    })

  const docs = await csv2json()
    .fromString(csvstr)
    .then(jsonObj => {
      return jsonObj.map((record: ExternalServices) => ({
        ...record,
      }))
    })

  for (const doc of docs) {
    // null itemの削除
    doc.services = doc.services.filter(elem => elem.name !== '')
    const { uid } = doc
    const docWithoutId = { ...doc }
    delete docWithoutId.uid
    if (uid !== null && uid) {
      await ref.doc(uid).set(docWithoutId)
    }
  }
  return 'OK'
}

export const recursiveDelete = functions.region('asia-northeast1').runWith({
  timeoutSeconds: 540,
  memory: '2GB'
}).https.onRequest((request, response) => {
  // TODO: Only allow admin users to execute this function.

  const colList = ['users', 'careers', 'skillStacks', 'skillTags', 'externalServices']
  const size = colList.length
  let i = 0
  for (const path of colList) {
    i++
    firebase_tools.firestore.delete(path, {
      project: process.env.GCLOUD_PROJECT,
      recursive: true,
      yes: true
    }).then(() => {
      if (i >= size) response.send('OK')
    }).catch((err: Error) => {
      console.log(err)
      response.send('Error')
    })
  }
})

export const initializeFirestore = functions.region('asia-northeast1').https.onRequest((request, response) => {
  userRegister().then(r => console.log('users: ' + r)).catch(err => console.log(err))
  careerRegister().then(r => console.log('careers: ' + r)).catch(err => console.log(err))
  skillStackRegister().then(r => console.log('skills: ' + r)).catch(err => console.log(err))
  externalServiceRegister().then(r => console.log('externalServices: ' + r)).catch(err => console.log(err))
  response.send('OK')
})
