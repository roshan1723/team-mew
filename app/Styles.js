import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    summary: { 
        flex: 1, 
        justifyContent: 'top', 
        alignItems: 'center', 
        marginTop:20, 
    },
    name: {
        fontSize: 32,
        textDecorationLine: 'underline',

    },
    table: {
        marginTop:30,
        flex:1,
        width: '100%'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
    },
    modifybutton: {
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 4,
        padding: 3,
        marginTop: 10,
        paddingHorizontal: 20,
        paddingLeft:10,
    },
    modifybuttonText: {
        fontSize: 24,
        
    }

});
