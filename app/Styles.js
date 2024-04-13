import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

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
        
    },
    entryContainer: {
        marginBottom: 10,
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
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
    },
    reportValueTime: {
        marginTop: 2,
        fontWeight: '400',
    },

    nutritionalInfoContainer: {
        marginTop: 15,
        paddingHorizontal: 40,
        //paddingRight: 40,
        //paddingLeft: 40,
        marginHorizontal: 0,
    },
    reportHeader: {
        //fontWeight: '800',
        textDecorationLine: 'underline',
        textAlign: 'center',
        
    },
    reportDetails: {
        textAlign: 'center',
        borderWidth: 1,
        paddingHorizontal: 20,
        left: 0,
    },
    reportDetailsRight: {
        textAlign: 'center',
        borderWidth: 1,
        paddingHorizontal: 0,
        right:30,
    },
});
