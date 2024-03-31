export class RoleMiddleware {
  static validRoles = (rolesId = []) => {
    return (req, res, next) => {

      try {
        const { id } = req.params;
        const { roles, id: idUser } = req.body.user;
        const isAdmin = roles.some(({ role }) => role === 'ADMIN');

        if (!Array.isArray(roles) || roles.some(({ role }) => typeof role !== 'string')) {
          throw new Error('Roles inválidos en req.body.user');
        }

        const hasAllowedRole = roles.some(({ role }) => rolesId.includes(role));

        if (isAdmin || +id === idUser && hasAllowedRole) {
          return next();
        } else {
          return res.status(401).json({ error: 'No autorizado' });
        }
      } catch (error) {
        console.error(error);
        return res.status(400).json({ error: 'Error en la validación de roles' });
      }
    }
  };
}