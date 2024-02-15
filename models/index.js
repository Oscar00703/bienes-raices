import Propiedad from './Propiedad.js'
import Precio from './Precios.js'
import Categoria  from './Categoria.js'
import Usuario from './Usuario.js'

Precio.hasOne(Propiedad,{ foreignKey: 'PrecioID'})
Propiedad.belongsTo(Categoria, {foreignKey: 'CategoriaID'})
Propiedad.belongsTo(Usuario, { foreignKey: 'UsuarioID'})



export {
    Propiedad,
    Precio,
    Categoria,
    Usuario
}