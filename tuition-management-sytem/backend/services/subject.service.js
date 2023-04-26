import subject from '../models/subject.model';

export const getAllSubjects = async () =>{
    return await subject.find();   
}

module.exports = {
    getAllSubjects
}