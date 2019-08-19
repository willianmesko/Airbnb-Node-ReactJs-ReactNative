'use strict'

const Helpers = use('Helpers')

const Image = use('App/Models/Image')
const Property = use('App/Models/Property')

class ImageController {

  async store({ request, params }) {
    const propperty = await Property.findOrFail(params.id)

    const images = request.file('image',{
      types: ['image'],
      size: '2mb'
     })

     await images.moveAll(Helpers.tmpPath('uploads'), file => ({
        name: `${Date.now()}-${file.clientName}`
    }))

    if(!images.movedAll()) {
      return images.errors()
    }

    await Promise.all(
      images
        .movedList()
        .map(image => propperty.images().create({ path: image.fileName }))
    )

  }

  async show({params, response}) {
    return response.download(Helpers.tmpPath(`uploads/${params.path}`))
  }
}

module.exports = ImageController
