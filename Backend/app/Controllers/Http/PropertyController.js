'use strict'
const Property = use('App/Models/Property');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with properties
 */
class PropertyController {
  /**
   * Show a list of all properties.
   * GET properties
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {

   const {latitude, longitude } = request.all()

   const properties = Property.query()
   .with('images')
   .nearBy(latitude,longitude, 10)
   .fetch()

    return properties
  }



  async store ({ auth, request, response }) {
    const { id } = auth.user
    const data = request.only([
        'title',
        'adress',
        'latitude',
        'longitude',
        'price'
      ])
      const property = await Property.create({...data, user_id : id })

      return property
  }


  async show ({ params }) {
    const property = await Property.findOrFail(params.id)

    await property.load('images')

    return property
  }



  async update ({ params, request, response }) {
    const property = await Property.findOrFail(params.id)

    const data = request.only([
      'title',
      'adress',
      'latitude',
      'longitude',
      'price'
    ])

    property.merge(data)

    await property.save()

    return property
  }

  async destroy ({ params, auth, response }) {
    const property = await Property.findOrFail(params.id)

    if(property.user_id !== auth.user_id){
      return response.status(401).send({error: 'Not authorized'})
    }

    await property.delete()

  }
}

module.exports = PropertyController
