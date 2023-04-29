import generator from 'generate-password';

export const generatePassword = () =>{
    return generator.generate({
        length : 8,
        numbers : true,
        uppercase : true,
        lowercase : true,
        symbols : true,
        excludeSimilarCharacters : true,
    });
}

export default generatePassword;