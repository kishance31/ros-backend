"use strict";

class BaseDao {
    constructor(dbModel) {
        //Get Model
        this.Model = dbModel;
    }

    // Save data in db
    async save(object) {
        return await this.Model.create(object);
    }

    async saveMany(object) {
        return await this.Model.insertMany(object);
    }

    // Find one document from db
    async findOne(query, projection) {
        return await this.Model.findOne(query, projection).exec();
    }

    // Find all docs from db
    async find(query, projection) {
        return await this.Model.find(query, projection).exec();
    }

    // Find one and update document in db
    async findOneAndUpdate(query, update, options) {
        return await this.Model.findOneAndUpdate(query, update, options).exec();
    }

    // // Find one and modify document in db
    // findAndModify(query, update, options) {
    //     return this.Model.findAndModify(query, update, options).exec();
    // }

    /**
     * Update Given Model
     * @param query
     * @param toUpdate
     * @return Promise Object
     * @private
    */

    // Update document in db
    update(query, update, options) {
        if (!options) {
            options = {};
        }
        return this.Model.update(query, update, options).exec();
    }

    // Remove document from db
    remove(query, options) {
        return this.Model.remove(query, options).exec();
    }

    // Find by id and remove document from db
    findByIdAndRemove(query, options) {
        return this.Model.findByIdAndRemove(query, options).exec();
    }

    // Use aggregate to get desire document from db
    aggregate(aggPipe) {
        return this.Model.aggregate(aggPipe).exec();
    }

    deleteOne(query) {
        return this.Model.deleteOne(query).exec();
    }

    updateMany(query, update, options) {
        return this.Model.update(query, update, options).exec();
    }
}
//========================== Class Definitions End =====================

module.exports = BaseDao;
