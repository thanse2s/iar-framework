exports.add = async function (db,salesman){
    return (await db.collection('salesman').insertOne(salesman)).insertedId;
}

exports.get = async function(db,id){
    return db.collection('salesman').findOne({employee_id:id});
}

exports.getAll = async function(db) {
    return db.collection('salesman').find({}).toArray();
}

exports.delete = async function(db, id){
    return db.collection('salesman').deleteMany({employee_id:id})
}

exports.update = async function(db, salesman){
    return db.collection('salesman').updateOne({employee_id:salesman.employee_id},
        {
            $set: {
                employee_id: salesman.employee_id,
                firstname: salesman.firstname,
                lastname: salesman.lastname,
                department: salesman.department
            }
        }).insertedId;
}