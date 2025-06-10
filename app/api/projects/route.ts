import { type NextRequest, NextResponse } from "next/server"

// Simulando um banco de dados com localStorage no servidor
// Em produção, isso seria substituído por um banco real como PostgreSQL, MongoDB, etc.

export async function GET() {
  try {
    // Em um ambiente real, isso viria do banco de dados
    const projects = [
      {
        id: "1",
        title: "Sistema de Agendamento Médico",
        description:
          "Plataforma completa para agendamento de consultas médicas com calendário interativo, notificações automáticas e gestão de pacientes",
        image: "/placeholder.svg?height=400&width=600",
        tech: ["TypeScript", "React", "TailwindCSS", "Node.js"],
        color: "from-emerald-500 to-teal-500",
        demo: "#",
        category: "Sistema Web",
        features: ["TypeScript para tipagem segura", "CSS responsivo", "JavaScript para interatividade", "API RESTful"],
        progress: 100,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "WaterGuardian - Monitor de Consumo de Água IoT",
        description:
          "Sistema completo de monitoramento em tempo real do consumo de água com sensores IoT, dashboard interativo, alertas de vazamento e relatórios de economia desenvolvido com TypeScript, CSS e JavaScript",
        image: "/images/waterguardian-screenshot.png",
        tech: ["TypeScript", "CSS Modules", "JavaScript", "WebSockets", "Chart.js"],
        color: "from-blue-500 to-cyan-500",
        demo: "https://waterguardian.vercel.app/",
        category: "IoT & Monitoramento",
        features: [
          "Dashboard em tempo real",
          "Sensores IoT integrados",
          "Alertas inteligentes",
          "Relatórios de economia",
        ],
        progress: 100,
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        title: "Landing Page Loja de Móveis",
        description:
          "Landing page moderna e elegante para loja de móveis com catálogo interativo, visualizador 3D e sistema de orçamentos",
        image: "/images/carvalho-moveis.png",
        tech: ["TypeScript", "TailwindCSS", "Next.js", "Framer Motion"],
        color: "from-amber-500 to-orange-500",
        demo: "https://lading-page-moveis.vercel.app/",
        category: "E-commerce",
        features: [
          "TypeScript para componentes",
          "CSS com animações",
          "JavaScript para interatividade",
          "Renderização otimizada",
        ],
        progress: 100,
        createdAt: new Date().toISOString(),
      },
    ]

    return NextResponse.json({ projects, success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar projetos", success: false }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validação dos dados
    const requiredFields = ["title", "description", "category", "tech", "features"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            error: `Campo ${field} é obrigatório`,
            success: false,
          },
          { status: 400 },
        )
      }
    }

    // Criar novo projeto
    const newProject = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description,
      image: body.image || "/placeholder.svg?height=400&width=600",
      tech: Array.isArray(body.tech) ? body.tech : [body.tech],
      color: body.color || "from-blue-500 to-cyan-500",
      demo: body.demo || "#",
      category: body.category,
      features: Array.isArray(body.features) ? body.features : [body.features],
      progress: body.progress || 0,
      createdAt: new Date().toISOString(),
    }

    // Em produção, aqui salvaria no banco de dados
    // Por enquanto, retornamos o projeto criado
    return NextResponse.json(
      {
        project: newProject,
        success: true,
        message: "Projeto criado com sucesso!",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro ao criar projeto",
        success: false,
      },
      { status: 500 },
    )
  }
}
