const mongoosePaginate = require('mongoose-paginate-v2');
module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            PN: String,
            TEST_TYPE: String,
            PASS: Number,
            TEST_DATE: Date
        },
    );
    schema.plugin(mongoosePaginate);

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Manufacturing = mongoose.model("Manufacturing", schema);
    return Manufacturing;
};