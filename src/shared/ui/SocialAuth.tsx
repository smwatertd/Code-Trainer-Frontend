type SocialProvider = "vk" | "google" | "github"

const PROVIDERS: { id: SocialProvider; label: string; glyph: string }[] = [
  { id: "vk", label: "Войти через VK", glyph: "VK" },
  { id: "google", label: "Войти через Google", glyph: "G" },
  { id: "github", label: "Войти через GitHub", glyph: "GH" },
]

type SocialAuthProps = {
  title?: string
  onPick: (provider: SocialProvider) => void
}

export default function SocialAuth({
  title = "Или войдите через",
  onPick,
}: SocialAuthProps) {
  return (
    <div className="social-subtle mt-[22px] text-center">
      <div className="mb-2.5 text-xs text-ink-faint">{title}</div>
      <div className="flex justify-center gap-2.5">
        {PROVIDERS.map((provider) => (
          <button
            key={provider.id}
            type="button"
            className={`social-ico ${provider.id}`}
            title={provider.label}
            onClick={() => onPick(provider.id)}
          >
            {provider.glyph}
          </button>
        ))}
      </div>
    </div>
  )
}

export type { SocialProvider }
