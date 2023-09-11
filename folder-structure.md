folder structure
└───src
   |   
   |   
   |
   │
   └───config
   │   │
   │   │
   │   └──────keys
   │   │     │
   │   │     └────── oauth-private.key
   │   │     └────── oauth-public.key
   │   │    
   |   └──────index.ts
   |
   |
   |
   │
   └───database
   │  │
   │  └──────migrations
   |  |
   │  └──────database.js
   │
   |
   |
   |
   └───errors
   |  │  
   │  └──────BadRequestError.ts
   │  │
   │  └──────DomainError.ts
   |  │
   │  └──────InternalServerError.ts
   |  │
   │  └──────ResourceNotFoundError.ts
   |  │
   │  └──────ConflictError.ts
   |  │
   │  └──────UnAuthorizedError.ts
   |  │
   │  └──────UnprocessableEntityError.ts
   |  |
   │  └──────index.ts
   |
   |
   |
   |
   └───helpers
   |  |   
   │  └──────errorHandler.ts
   │  │
   │  └──────response.ts
   |  │
   │  └──────server.ts
   |  │
   │  └──────utilities.ts
   |
   |
   |
   |
   └───middlewares
   |  |
   |  └──────authenticate.ts
   |
   |
   |
   │
   └───modules
   |  │
   │  └─────auth
   |  |     │  
   |  |     └──────auth.constant.ts
   |  |     │  
   |  |     └──────auth.controller.ts
   |  |     │  
   |  |     └──────auth.helper.ts
   |  |     │  
   |  |     └──────auth.interface.ts
   |  |     │  
   |  |     └──────auth.route.ts
   |  |     │  
   |  |     └──────auth.service.ts
   |  |     │  
   |  |     └──────auth.validation.ts
   |  |     │  
   |  |     └──────index.ts
   │  │
   │  └───wallet
   |  |
   |  └───routes.ts
   |
   |
   │
   │
   └───utils
   │   │    
   |   └──────logger.ts
   |   |
   |   └──────validator.ts
   │
   |
   |  
   │  
   └───app.ts
   |
   |
   |
   |
   └───server.ts
