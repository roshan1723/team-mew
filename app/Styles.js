import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
    summary: { 
        flex: 1, 
        justifyContent: 'top', 
        alignItems: 'center', 
        marginTop:20, 
        //backgroundColor: '#500000',
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
        
    },
    entryContainer: {
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#500000',
    },
    reportRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingRight: 0,
        marginHorizontal: 0,
    },
    reportCell: {
        flex: 1,
        marginRight: 0,
        paddingRight: 0,
    },

    reportValue: {
        marginTop: 2,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    reportValueTime: {
        marginTop: 2,
        fontWeight: '400',
        color: '#FFFFFF',
    },

    nutritionalInfoContainer: {
        marginTop: 15,
        //paddingRight: 40,
        //paddingLeft: 40,
        marginHorizontal: 0,
    },
    reportHeader: {
        //fontWeight: '800',
        textDecorationLine: 'underline',
        textAlign: 'center',
        color: '#FFFFFF',
    },
    reportDetails: {
        textAlign: 'center',
        borderWidth: 1,
        left: 0,
        borderColor: '#FFFFFF',
        color: '#FFFFFF',
    },
    reportDetailsRight: {
        textAlign: 'center',
        borderWidth: 1,
        paddingHorizontal: 0,
    },
    column: {
        width: 150,
    },
    tableRow: {
        flexDirection: 'row',
        paddingHorizontal: '9.5%',
    },
});
